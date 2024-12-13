const db = require("../models/db");

module.exports.register = async (req, res, next) => {
  const { username, password, confirmPassword, email } = req.body;
  try {
    // validation
    if (!(username && password && confirmPassword)) {
      return next(new Error("Fulfill all inputs"));
    }
    if (confirmPassword !== password) {
      throw new Error("confirm password not match");
    }

    const data = {
      username,
      password,
      email
    };

    const rs = await db.user.create({ data  })
    console.log(rs)

    res.json({ msg: 'Register successful' })
  } catch (err) {
    next(err);
  }
};

module.exports.login = async (req, res, next) => {
  const {username, password} = req.body
  try {
    // validation
    if( !(username.trim() && password.trim()) ) {
      throw new Error('username or password must not blank')
    }
    // find username in db.user
    const user = await db.user.findFirstOrThrow({ where : { username }})
    // check password
    if (user.password !== password) {
      throw new Error('Invalid login credentials');
    }
    // issue jwt token 
    // const payload = { id: user.id }
    // const token = jwt.sign(payload, process.env.JWT_SECRET, {
    //   expiresIn: '30d'
    // })
    // console.log(token)
    res.json(user)
  }catch(err) {
    next(err)
  }
};


module.exports.updateUser = async (req, res, next) => {
  const { username, password, email } = req.body;
  const { id } = req.params;
  
  // แปลง id ให้เป็น Integer
  const userId = parseInt(id, 10);

  if (isNaN(userId)) {
    return next(new Error('Invalid user ID'));
  }

  try {
    // ตรวจสอบว่าข้อมูลที่กรอกไม่ว่างเปล่า
    if (!(username && password && email)) {
      return next(new Error("Fulfill all inputs"));
    }

    // หาผู้ใช้จากฐานข้อมูล
    const user = await db.user.findFirstOrThrow({
      where: { id: userId },  // ใช้ userId ที่แปลงเป็น Integer แล้ว
    });

    if (!user) {
      throw new Error('User not found');
    }

    // อัปเดตข้อมูลผู้ใช้
    const updatedUser = await db.user.update({
      where: { id: userId },  // ใช้ userId ที่แปลงเป็น Integer แล้ว
      data: {
        username: username,
        password: password, // ในที่นี้ยังใช้ password เป็นข้อความทั่วไป, คุณอาจจะต้องเข้ารหัสมัน
        email: email,
        updatedAt: new Date(),
      },
    });

    res.json({ msg: 'User updated successfully', user: updatedUser });
  } catch (err) {
    next(err);
  }
};

module.exports.deleteUser = async (req, res, next) => {
  const { id } = req.params;  // ดึง id ผู้ใช้จากพารามิเตอร์ใน URL
  
  // แปลง id ให้เป็น Integer
  const userId = parseInt(id, 10);

  if (isNaN(userId)) {
    return next(new Error('Invalid user ID'));
  }

  try {
    // หาผู้ใช้จากฐานข้อมูลก่อนว่ามีอยู่หรือไม่
    const user = await db.user.findFirstOrThrow({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // ลบข้อมูลผู้ใช้
    await db.user.delete({
      where: { id: userId },
    });

    res.json({ msg: 'User deleted successfully' });
  } catch (err) {
    next(err);
  }
};

exports.getUsers =async(req,res,next)=>{
  try {
    const users = await db.user.findMany({
      select: {
        id: true,
        username: true,
      },
      where: { role: "user" },
    });
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



