ระบบจองสนามฟุตบอล

เกี่ยวกับโครงงานนี้

หัวข้อปริญญานิพนธ์:  ระบบจองสนามฟุตบอล
จัดทำโดย: นายธีรโชติ เหล่าเทพ

ปีที่ปริญญานิพนธ์สำเร็จ พ.ศ. 2567
สาขาวิชา วิศวกรรมคอมพิวเตอร์

อาจารย์ที่ปรึกษา: ดร.เฉลิมวุฒิ น้อยอุ่นแสน

บทคัดย่อ
ระบบจองสนามฟุตบอลถูกออกแบบมาเพื่อให้ผู้ใช้สามารถจองสนามฟุตบอลออนไลน์ได้อย่างง่ายดายและสะดวกสบาย โดยมีวัตถุประสงค์ในการเพิ่มประสิทธิภาพในการจัดการสนามฟุตบอล ลดความซับซ้อนในการจอง และเพิ่มความสะดวกสบายให้กับผู้ใช้งานทั้งผู้จองและผู้ดูแลสนาม นอกจากนี้ยังสามารถช่วยให้ผู้ดูแลสนามสามารถจัดการข้อมูลการจองและการใช้สนามได้อย่างมีประสิทธิภาพ
คณะผู้จัดทำศึกษาข้อมูลเพื่อเว็บพัฒนาแอปพลิเคชันระบบจองสนามฟุตบอล เริ่มต้นด้วยการออกแบบฐานข้อมูลโดยใช้ MySQL เพื่อจัดการข้อมูลเชิงสัมพันธ์ที่เกี่ยวข้องกับผู้ใช้ สนามฟุตบอล การจอง และผู้ดูแลระบบ การออกแบบนี้ช่วยให้สามารถเชื่อมโยงและจัดการข้อมูลได้อย่างมีระเบียบและง่ายต่อการเรียกใช้งาน ส่วนหน้าของเว็บแอปพลิเคชันถูกพัฒนาโดยใช้ HTML, CSS, และ JavaScript เพื่อสร้างโครงสร้างและการทำงานของหน้าเว็บ การใช้ JavaScript ช่วยเพิ่มความสามารถในการตอบสนองและการทำงานของเว็บ และใช้ React เป็นเฟรมเวิร์กเพื่อปรับปรุงประสิทธิภาพและความสามารถในการพัฒนาส่วนหลังของเว็บแอปพลิเคชันถูกพัฒนาด้วย Node.js ร่วมกับ Express.js สำหรับการจัดการและประมวลผลข้อมูล การเชื่อมต่อกับฐานข้อมูลและการจัดการคำขอจากผู้ใช้ เทคโนโลยีนี้ช่วยให้ระบบทำงานได้อย่างรวดเร็วและมีประสิทธิภาพในการให้บริการ
โครงการพัฒนาระบบจองสนามฟุตบอลได้รับความสำเร็จอย่างมีนัยสำคัญในหลายด้าน ผู้ใช้งานตอบรับดีต่อความสะดวกสบายและประสิทธิภาพของระบบในการจองสนามฟุตบอลที่เชื่อถือได้ ผู้ใช้สามารถทำการลงทะเบียนและเข้าสู่ระบบได้อย่างสะดวก มีการจองที่รวดเร็วและไม่ซับซ้อน มุ่งเน้นให้ผู้ใช้สามารถทำธุรกรรมได้อย่างตรงไปตรงมาตามความต้องการ

Abstract
The football field booking system is designed to allow users to book football fields online easily and conveniently. With the objective of increasing efficiency in football field management. Simplify booking and increase convenience for users, both bookers and field administrators. It can also help field operators to efficiently manage booking and field usage information.
The team studied data for web development of a football field reservation system application. It begins with designing a database using MySQL to manage relational data related to users, football stadiums, bookings, and administrators. This design allows data to be linked and organized in an orderly and easy-to-use manner. The front end of a web application is developed using HTML, CSS, and JavaScript to create the structure and functionality of the web page The use of JavaScript improves the responsiveness and functionality of the web and React is used as a framework to improve the performance and development capabilities of the backend. The web application is developed with Node.js along with Express.js for data management and processing Connecting to databases and managing requests from users This technology allows the system to work quickly and efficiently in providing services.
The football field reservation system development project has achieved significant success in many areas. Users respond well to the convenience and efficiency of the system in reliably booking football stadiums. Users can register and log in conveniently. Bookings are quick and simple. Focus on allowing users to conduct transactions in a straightforward manner according to their needs.

** api_service **

methof                path              params      body

POST                /auth/register      none        {username, password confirmPassword , email}
POST                /auth/login         none        {username, password}
PUT                 /todo/              :id         {title, duedate}
