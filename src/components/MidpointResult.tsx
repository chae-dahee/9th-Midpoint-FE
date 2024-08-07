import { BACKEND_URL } from '@/apis';
import { FROM_ALONE_RESULT } from '@/constants';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function MidpointResult() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [midPoints, setMidPoints] = useState(null);

  async function handleAloneResult() {
    try {
      const { data } = await axios.get(BACKEND_URL + '/api/mid-points', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          RoomId: roomId,
        },
      });
      setMidPoints(data.data);
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        navigate(`/page/login/${roomId}`, { state: { from: FROM_ALONE_RESULT } });
      }
      if (error.response && error.response.status === 403) {
        navigate(`/page/alone/${roomId}`);
      }
    }
  }

  useEffect(() => {
    handleAloneResult();
  }, [roomId]);

  return (
    <>
      <h1>중간지점결과화면</h1>
      <h1>{JSON.stringify(midPoints)}</h1>
    </>
  );
}
