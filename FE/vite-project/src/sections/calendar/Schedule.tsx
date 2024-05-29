import moment from "moment";
import "moment/dist/locale/ko";
import styled from "styled-components";
import { AddSchedule } from "./AddSchedule";
import { useEffect, useState } from "react";
import { MomentInput } from "moment";
import { useSelectedDateStore } from "@/store/DateStore";
import { useSelectedItemsStore } from "@/store/ClothesStore";
import HaveOutfit from "./HaveOutfit";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface SchedulePropType {
  date: Date | Value | null;
  attendDay: string[];
}

const Schedule = ({ date, attendDay }: SchedulePropType) => {
  moment.locale("ko");

  const selectedformat: string | null = moment(date as MomentInput).format(
    "M월 DD일 (dd)"
  );

  const selected = moment(date as MomentInput).format("YYYY-MM-DD");

  return (
    <ScheduleWrapper>
      <p>{selectedformat}</p>
      {attendDay.includes(selected) ? (
        <HaveOutfit date={date} />
      ) : (
        <NoSchedule
          date={date}
          attendDay={attendDay}
          selected={selectedformat}
        />
      )}
    </ScheduleWrapper>
  );
};

export default Schedule;

const ScheduleWrapper = styled.div`
  margin-top: 0.5rem;
  box-sizing: border-box;
  padding: 1rem 1rem;
  width: 100%;
  background-color: white;
  border-radius: 1rem;
`;

type popupType = boolean;
type NoSchedulePropType = {
  date: Date | Value | null;
  attendDay: string[];
  selected: string | null;
};

const NoSchedule = ({ date, attendDay, selected }: NoSchedulePropType) => {
  const [popup, setPopup] = useState<popupType>(false);
  const { setTitle, setSelectedDate, setSelectedKeyword, selectedKeyword } =
    useSelectedDateStore();
  const { clearItems } = useSelectedItemsStore();

  const isSelectedDatePast = moment(date as MomentInput).isBefore(
    moment(),
    "day"
  );

  // attendDay 배열에 selected 날짜가 있는지 확인
  const selectedDate: string | null = moment(date as MomentInput).format(
    "yyyy-MM-DD"
  );

  const isDateInAttendDay = attendDay.includes(selectedDate);

  const isWithinNextFiveDays = moment(date as MomentInput).isBetween(
    moment(),
    moment().add(4, "days"),
    "day",
    "[]"
  );

  useEffect(() => {
    if (selectedKeyword.length > 1) {
      setPopup(true);
    }
  }, []);

  return (
    <ContentWrapper>
      {isSelectedDatePast ? (
        isDateInAttendDay ? (
          <HaveOutfit date={date} />
        ) : (
          <p className="description">이 날 등록된 일정이 없습니다.</p>
        )
      ) : (
        <>
          <p className="description">아직 등록된 일정이 없습니다.</p>
          <GreenButton
            onClick={() => {
              setPopup(true);
              clearItems();
              setSelectedKeyword("");
              setTitle("");
              if (selectedDate) {
                setSelectedDate(selectedDate);
              }
            }}
          >
            일정 등록하기
          </GreenButton>
        </>
      )}
      {popup ? (
        <AddSchedule
          setPopup={setPopup}
          selected={selected}
          isWithinNextFiveDays={isWithinNextFiveDays}
        />
      ) : null}
    </ContentWrapper>
  );
};

const ContentWrapper = styled.div`
  position: relative;
  margin-top: 0.5rem;
  box-sizing: border-box;
  padding: 1rem 1rem;
  width: 100%;
  ${({ theme }) => theme.common.flexCenterColumn};

  .description {
    color: ${(props) => props.theme.colors.grey};
    margin-bottom: 1rem;
  }
`;

const GreenButton = styled.button`
  ${({ theme }) => theme.common.PointButton};
  opacity: 0.7;
  width: 50%;
  padding: 1rem 1rem;
`;
