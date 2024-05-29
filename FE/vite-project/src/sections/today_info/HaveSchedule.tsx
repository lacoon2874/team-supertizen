import styled from "styled-components";
import CoordiImage from "@/components/CoordiImage";


interface ScheduleProps {
    schedule:string;
    outfit: string; 
}


const HaveSchedule = ({schedule, outfit}: ScheduleProps) => {
    return (
        <Container>
            {schedule == '없음' ? <Message>오늘 예약된 코디</Message>
            :  <Message>오늘 <Schedule>{schedule}</Schedule>에 예약된 코디</Message>            
            }
            <TodayCoordi>

                <CoordiImage outfit={outfit}/>
            </TodayCoordi>
        </Container>
    );
};

export default HaveSchedule;


const Container = styled.div`
margin-bottom: 0.1rem;

`

const Message = styled.div`
text-align:center;
padding: 1rem;
font-size: 1.2rem;
font-weight: bolder;
color: #8d8d8d;
`
const Schedule = styled.span`
font-size: 1.4rem;
color: black;
opacity: 0.8;
`
const TodayCoordi = styled.div`
height: 23vh;
width: 23vh;
margin: 0 auto;
padding: 0.2rem;
`