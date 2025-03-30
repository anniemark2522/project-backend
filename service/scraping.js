import axios from 'axios';
import { load } from 'cheerio';
import fs from 'fs';

// ฟังก์ชั่นดึงข้อมูลจากเว็บไซต์
const fetchData = async () => {
    try {
        // ดึงข้อมูล HTML จากเว็บไซต์
        const { data } = await axios.get('https://www.nowmuaythai.com/muay-thai-visa/certified-camps');

        // ใช้ Cheerio เพื่อแยกข้อมูลจาก HTML
        const $ = load(data);

        // สร้างอ็อบเจกต์เพื่อเก็บข้อมูลจังหวัดและค่าย
        let provinces = {};

        // ค้นหาข้อมูลจาก div ที่มีการใช้ collapse-arrow ซึ่งประกอบด้วยชื่อจังหวัด
        $('.collapse-title').each((index, provinceElement) => {
            // ดึงชื่อจังหวัดจากส่วนของ <h3>
            const provinceName = $(provinceElement).find('h3').text().trim();

            // สร้างอาร์เรย์สำหรับเก็บชื่อค่ายในจังหวัดนั้น
            let gymsInProvince = [];

            // ค้นหาข้อมูลค่ายมวยในจังหวัดนั้น ๆ
            $(provinceElement).next('.collapse-content').find('li').each((index, gymElement) => {
                const gymName = $(gymElement).text().trim();
                gymsInProvince.push(gymName);
            });

            // เพิ่มข้อมูลในอ็อบเจกต์ provinces
            if (provinceName) {
                provinces[provinceName] = gymsInProvince;
            }
        });

        // เขียนข้อมูลลงไฟล์ JSON
        fs.writeFileSync('new_gyms_by_province.json', JSON.stringify(provinces, null, 2));
        console.log('Data has been written to gyms_by_province.json');
    } catch (error) {
        console.error('Error fetching the data: ', error);
    }
};

// เรียกใช้ฟังก์ชั่น
fetchData();
