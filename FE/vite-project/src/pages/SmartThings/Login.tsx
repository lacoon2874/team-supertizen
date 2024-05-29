import { Container, Title, Form, Button } from "@/pages/SmartThings/smartStyle";
import { useEffect, useState } from "react";
import { usePostLogin } from "@/hooks/usePostLogin";

function Login() {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const { mutate } = usePostLogin();

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setUserEmail(value);
    console.log(userEmail);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setUserPassword(value);
    console.log(userPassword);
  };

  const handlelogin = (): void => {
    const data = {
      email: userEmail,
      password: userPassword,
    };
    mutate(data);
  };

  useEffect(() => {
    // 페이지나 컴포넌트가 마운트될 때 색상을 변경
    document
      .querySelector('meta[name="theme-color"]')
      .setAttribute("content", "#648FBA");

    // 컴포넌트가 언마운트될 때 원래 색상으로 복원(선택적)
    return () => {
      document
        .querySelector('meta[name="theme-color"]')
        .setAttribute("content", "#ffffff");
    };
  }, []);

  return (
    <Container>
      <Title>SmartThings</Title>
      <Form>
        <p className="formtitle">삼성 계정으로 로그인</p>
        <form>
          <input
            className="forminput"
            type="text"
            placeholder="전화번호"
            onChange={handleEmailChange}
            value={userEmail}
          />
          <input
            className="forminput"
            type="password"
            placeholder="비밀번호"
            autoComplete="off"
            value={userPassword}
            onChange={handlePasswordChange}
          />
        </form>

        <Button onClick={handlelogin}>로그인</Button>
        <p className="extra">ID 찾기 또는 비밀번호 재설정</p>
        <p className="extra">계정 생성</p>
      </Form>
    </Container>
  );
}

export default Login;
