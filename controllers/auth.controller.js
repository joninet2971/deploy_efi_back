const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require('crypto')
const { User } = require("../models");
const {sendEmail} = require("../utils/nodemailer")

// Login de usuario
const login = async (req, res) => {
  const { correo, password } = req.body;

  try {
    const user = await User.findOne({ where: { correo } });
    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    // Compara password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // token
    const token = jwt.sign(
      { sub: user.id, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login exitoso",
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        correo: user.correo,
        rol: user.rol,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Error en el login",
      error: error.message,
    });
  }
};

// Obtener usuario autenticado

const me = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.sub, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    return res.status(200).json(user);
  } catch (err) {
    console.error("Error en /me:", err.message);
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
};

const resetTokens = new Map()

const resetEmailTemplate = ({nombre, resetUrl}) => {
    return `
    <div style="max-width: 520px; margin:0; padding: 20px;">
        <h2>Recupera tu contraseña</h2>
        <p>Hola ${nombre || ''}, recibimos tu solicitud para restablecer la contraseña.</p>
        <p>Hace click en el boton para continuar.</p>
        <p>
            <a href=${resetUrl}>
                Cambiar contraseña
            </a>
        </p>
        <p>Si no fuiste vos, podes ignorar el mensaje</p>
    </div>
    `
}

const forgotPassword = async(req,res) => {
    const {email} = req.body

    try {
      console.log("ENTRO HASTA ACA")
      const user = await User.findOne({ where: { correo: email } });
      if (!user) return res.status(400).json({ message: "No existe el usuario" });
 
      const rawToken = crypto.randomBytes(32).toString('hex')
      const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex')
      const expiresAt = Date.now + 15*60*1000

      resetTokens.set(user.id,{tokenHash,expiresAt})

      const resetUrl = `${process.env.FRONT_URL}/recuperar-contraseña?token=${rawToken}&id=${user.id}`
        
      await sendEmail({
          to: user.correo,
          subject:'Recuperar contraseña',
          html: resetEmailTemplate({ nombre: user.nombre, resetUrl })
      })
        
      return res.status(201).json({message: 'Email enviado correctamente'})
    
  } catch (error) {
      return res.status(500).json({ message: 'Error al enviar el mail', error: error.message });
  }
}

const resetPassword = async(req, res) => {
    const { id, token, password } = req.body
    
    if (!id || !token || !password) return res.status(400).json({message: "Faltan datos"})
    
    try {
        const entry = resetTokens.get(Number(id))
        if (!entry) return res.status(400).json({message: "El token es invalido"})
        
        if(entry.expiresAt < Date.now()){
            return res.status(400).json({message: "El token está vencido"})
        }
        
        const tokenHash = crypto.createHash('sha256').update(token).digest('hex')

        if(tokenHash !=entry.tokenHash) return res.status(400).json({message: "El token es invalido"})
        
        const user = await User.findByPk(id)
        if (!user) return res.status(400).json({ message: 'El usuario no existe' })

        user.password = await bcrypt.hash(password, 10)
        await user.save()

        resetTokens.delete(Number(id))

        return res.status(201).json({message: "La contraseña se actualizó con éxito"})

    } catch (error) {
        return res.status(500).json({ message: 'Error al resetear el password', error: error.message });

    }
}

module.exports = { login, me, forgotPassword, resetPassword };

