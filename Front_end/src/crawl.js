import axios from "axios";

// Danh sách slug Homestay (nếu có API lấy theo slug, còn không thì bạn có thể lấy danh sách cụ thể từ backend hoặc để trống)
const homestaySlugs = ['homestay-da-nang', 'homestay-da-lat', 'homestay-hue'];

const headers = {
    'Content-Type': 'application/json',
};

// Thêm Homestay và các phòng tương ứng
export const addHomestay = async (homestay, rooms) => {
    try {
        const response = await axios.post('https://localhost:7102/api/homestay/add', JSON.stringify(homestay), { headers });
        const result = response.data;
        console.log(result.message);

        if (result.status === 400) {
            return { status: result.status };
        }

        const roomMessages = await Promise.all(
            rooms.map(async room => {
                const roomWithHomestayId = { ...room, homestayId: result.data.id };
                const message = await addRoom(roomWithHomestayId);
                console.log(message);
                return message;
            })
        );

        return { status: roomMessages };
    } catch (error) {
        console.error(error);
    }
};

// Thêm một phòng
export const addRoom = async (room) => {
    try {
        const response = await axios.post('https://localhost:7102/api/room/add', JSON.stringify(room), { headers });
        const result = response.data;
        return { status: result.status };
    } catch (error) {
        console.error(error);
    }
};

// Gọi API để lấy dữ liệu homestay và phòng theo slug (hoặc bất kỳ định danh nào bạn sử dụng)
export const fetchHomestayAndRooms = async (slug) => {
    try {
        const response = await axios(`https://your-api-url/homestay?slug=${slug}`);
        const result = response.data;

        const homestay = {
            name: result.data.homestay.name,
            location: result.data.homestay.location,
            description: result.data.homestay.description,
        };

        const rooms = result.data.rooms.map(room => ({
            name: room.name,
            price: room.price,
            maxGuests: room.maxGuests,
            type: room.type,
            imagePath: room.imageUrl,
        }));

        return { homestay, rooms };
    } catch (error) {
        console.error(error);
    }
};

// Gọi tất cả các homestay theo danh sách slug
export const getAllHomestayData = async () => {
    try {
        const data = await Promise.all(
            homestaySlugs.map(async slug => {
                const response = await fetchHomestayAndRooms(slug);
                return {
                    homestay: response.homestay,
                    rooms: response.rooms,
                };
            })
        );
        return data;
    } catch (error) {
        console.error(error);
    }
};

// Gửi toàn bộ homestay + phòng vào server backend
export const postAllHomestays = async () => {
    const data = await getAllHomestayData();
    if (data) {
        try {
            const messages = await Promise.all(
                data.map(async (item) => {
                    const response = await addHomestay(item.homestay, item.rooms);
                    return response.status;
                })
            );
            return messages;
        } catch (error) {
            console.error(error);
        }
    }
};
