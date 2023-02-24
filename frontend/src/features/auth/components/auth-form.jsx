import styled from "@emotion/styled";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border-radius: 10px;
`;

const AuthForm = ({ children, ...props }) => {
  return <Form {...props}>{children}</Form>;
};

export default AuthForm;
