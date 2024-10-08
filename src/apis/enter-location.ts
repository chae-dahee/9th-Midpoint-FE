import { ROOM_TYPE_ALONE, ROOM_TYPE_EACH } from '@/constants';
import { axiosInstance, BACKEND_URL } from '.';

export const fetchAloneSavePlace = async (usersPlace: any, roomId: string) => {
  return axiosInstance.post(
    '/api/place-rooms/self',
    { addresses: usersPlace },
    {
      headers: {
        RoomId: roomId,
        RoomType: ROOM_TYPE_ALONE,
      },
      withCredentials: true,
    },
  );
};

export const fetchEachSavePlace = async (data: any, roomId: string) => {
  return axiosInstance.post('/api/place-rooms', data, {
    headers: {
      RoomId: roomId,
      RoomType: ROOM_TYPE_EACH,
    },
    withCredentials: true,
  });
};

export const fetchGetEachPlaceInfo = async (roomId: string) => {
  const { data } = await axiosInstance.get(BACKEND_URL + '/api/place-rooms', {
    headers: {
      RoomId: roomId,
      RoomType: ROOM_TYPE_EACH,
    },
  });
  return data.data;
};
