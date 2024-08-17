import React, { useState } from 'react';
import styled from 'styled-components';
import Calendar from 'react-calendar';

import 'react-calendar/dist/Calendar.css';
import CalIcon from '@/assets/imgs/Time/time-calItem-icon1.svg?react';
import { Value, ValuePiece } from '@/pages/Time/time';
import VoteDate from './vote-date';
import { ResultResponse, VoteDateInfo } from '@/pages/TimeVote/time-vote';

// 타입 정의
export interface DateTimeOption {
  date: Value;
  startTime: Time;
  endTime: Time;
}

export interface Time {
  hour: number;
  minute: number;
}

interface VoteCalendarProps {
  selectedDates: ValuePiece[];
  resultRes: ResultResponse | null;
  clickedDate: ValuePiece;
  setClickedDate: (date: ValuePiece) => void;
}

export const formatTime = (time: number) => (time < 10 ? `0${time}` : time);

const VoteCalendar: React.FC<VoteCalendarProps> = ({ selectedDates, resultRes, clickedDate, setClickedDate }) => {
  const [voteDateInfo, setVoteDateInfo] = useState<VoteDateInfo[]>([]);

  const handleDateClick = (date: Value | ValuePiece) => {
    if (date instanceof Date) {
      const isSelected =
        selectedDates.some(
          (selectedDate) => selectedDate instanceof Date && selectedDate.toDateString() === date.toDateString(),
        );

      if (isSelected) {
        setClickedDate(date);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        const dateString = `${year}-${month}-${day}`;
        console.log('캘린더에서 클릭한 날짜', dateString);

        if (resultRes) {
          let foundInfo = resultRes.result[dateString];

          if (foundInfo) {
            console.log('해당 날짜의 하위 정보:', foundInfo);
            setVoteDateInfo(foundInfo);

            if (foundInfo.length === 0) console.log('빈값');
          } else {
            console.log('해당 날짜에 대한 정보가 없습니다.');
          }
        }
        setClickedDate(date);
      } else {
        setClickedDate(null);
      }
    } else {
      console.warn('클릭한 날짜는 유효한 Date 형식이 아닙니다:', date);
    }
  };

  return (
    <>
      <div className="flex flex-col item-center justify-start">
        <ContainerItem>
          <CalIcon />
          <StyledCalendar
            value={null}
            onChange={(value) => handleDateClick(value)}
            locale="ko-KR"
            selectRange={false}
            formatDay={(_locale, date) => date.getDate().toString()} //일 제거
            calendarType="gregory" //일요일
            showNeighboringMonth={false} // 전달, 다음달 날짜 숨기기
            next2Label={null} // +1년 & +10년 이동 버튼 숨기기
            prev2Label={null} // -1년 & -10년 이동 버튼 숨기기
            minDetail="year" // 10년단위 년도 숨기기
            tileClassName={({ date }) =>
              selectedDates.some(
                (selectedDate) => selectedDate instanceof Date && selectedDate.toDateString() === date.toDateString(),
              )
                ? 'selected'
                : ''
            }
            tileDisabled={({ date }) =>
              !selectedDates.some(
                (selectedDate) => selectedDate instanceof Date && selectedDate.toDateString() === date.toDateString(),
              )
            }
            onClickDay={(date) => {
              if (
                selectedDates.some(
                  (selectedDate) => selectedDate instanceof Date && selectedDate.toDateString() === date.toDateString(),
                )
              ) {
                handleDateClick(date);
              }
            }}
          />
        </ContainerItem>
        {clickedDate && <VoteDate clickedDate={clickedDate} voteDateInfo={voteDateInfo} />}
      </div>
    </>
  );
};

const ContainerItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 40%;
  min-width: 480px;
  min-height: 500px;
  background: #f8f8fb;
  padding: 10px 5px;
  margin: 10px;
  border-radius: 15px;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  color: #2f5fdd;
`;

const StyledCalendar = styled(Calendar)`
  width: 88%;
  height: 100%;
  background: #f8f8fb;
  border: none;
  border-radius: 10px;
  margin-top: 10px;

  //전체 폰트 컬러
  .react-calendar__month-view {
    abbr {
      color: #15254d;
    }
  }
  //년/월 상단 네비게이션 정렬, 크기 줄이기
  .react-calendar__navigation {
    justify-content: center;
  }
  .react-calendar__navigation__label {
    font-weight: bold; /* 년월을 굵게 표시 */
    color: #2f5fdd;
    flex-grow: 0 !important;
  }
  .react-calendar__navigation:enabled:hover {
    background-color: #5786ff !important;
    border-radius: 5px !important;
  }

  //요일 색, 밑줄
  .react-calendar__month-view__weekdays__weekday--weekend abbr[title='일요일'] {
    color: #ff3629;
  }
  .react-calendar__month-view__weekdays__weekday abbr[title='토요일'] {
    color: #5786ff;
  }
  .react-calendar__month-view__weekdays abbr {
    text-decoration: none;
    font-weight: 800;
  }

  //일 스타일
  .react-calendar__tile {
    max-width: initial !important;
    border-radius: 5px; /* 모든 날짜 타일을 동그랗게 */
    cursor: pointer;

    &:hover {
      background: #5786ff;
      color: white;
      border-radius: 5px;
    }
  }
  //일 날짜 간격
  .react-calendar__tile {
    padding: 5px 0px 30px;
    position: relative;
  }
  //일 오늘 날짜
  .react-calendar__tile--now {
    background: none;
    abbr {
      color: #5c76ff;
    }
  }

  /* 클릭 불가능한 날짜 (마우스 오버 또는 포커스 상태) */
  .react-calendar__tile:disabled:hover,
  .react-calendar__tile:disabled:focus {
    background-color: transparent; /* 기본 배경색으로 설정 */
    cursor: not-allowed; /* 커서를 금지 아이콘으로 변경 */
  }

  /* 클릭한 날짜 (마우스 오버 또는 포커스 상태) */
  .react-calendar__tile:enabled:hover,
  .react-calendar__tile:enabled:focus {
    background-color: #377bff !important; /* 클릭한 날짜 색상 */
    border-radius: 5px !important;
  }

  /* 클릭된 날짜 (현재 선택된 날짜) */
  .react-calendar__tile--active,
  .selected {
    background-color: #bcd7ff !important; /* 클릭된 날짜 색상 */
    border-radius: 5px !important;
  }

  /* 클릭한 날짜의 텍스트 색상 */
  .react-calendar__tile--active abbr,
  .selected abbr {
    color: #377bff; /* 텍스트 색상 */
  }

  .react-calendar__tile:enabled:hover abbr,
  .react-calendar__tile:enabled:focus abbr {
    color: white;
  }
`;

export default VoteCalendar;