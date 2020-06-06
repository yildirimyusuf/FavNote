import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Formik, Form } from 'formik';
import Input from 'components/atoms/Input/Input';
import Button from 'components/atoms/Button/Button';
import Heading from 'components/atoms/Heading/Heading';
import Paragraph from 'components/atoms/Paragraph/Paragraph';
import logoIcon from 'assets/icons/logo.svg';
import withContext from 'hoc/withContext';
import { Link, Redirect } from 'react-router-dom';
import { routes } from 'routes';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { authenticate as authenticateAction } from 'actions';

const StyledWrapper = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.notes};
`;

const StyledContentWrapper = styled.div`
  position: fixed;
  top: 5%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const StyledHeader = styled.div`
  width: 450px;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 60px 80px;
  box-shadow: 0 10px 30px -10px hsla(0, 0%, 0%, 0.3);
  border-radius: 10px;
  background-color: ${({ theme }) => theme.gray100};
`;

const StyledInput = styled(Input)`
  width: 100%;
  border: 1px solid;
  border-color: ${props => props.border || '#ddd'};
  background-color: hsl(0, 0%, 90%);
`;

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const StyledButton = styled(Button)`
  margin: 20px auto 0;
  background-color: ${({ theme }) => theme.notes};
  position: relative;
  opacity: ${({ disabled }) => (disabled ? '0.5' : '1')};
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  &::before {
    content: '';
    position: absolute;
    left: 17%;
    top: 13px;
    width: 20px;
    height: 20px;
    border: 3px solid ${({ theme }) => theme.dark};
    border-top: 3px solid transparent;
    border-bottom: 3px solid transparent;
    border-radius: 50%;
    opacity: ${({ disabled }) => (disabled ? '1' : '0')};
    animation: ${spin} 1s ease infinite;
  }
`;

const StyledLink = styled(Button)`
  display: flex;
  align-items: center;
  margin-top: 15px;
  text-decoration: none;
  text-align: center;
  color: ${({ theme }) => theme.dark};
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: ${({ theme }) => theme.bold};
  border: 2px solid ${({ theme }) => theme.notes};
  cursor: pointer;
  &:hover {
    border-color: ${({ theme }) => theme.notes100};
  }
`;

const StyledHeading = styled(Heading)`
  margin: 10px 0;
  font-size: ${({ theme }) => theme.fontSize.lm};
`;

const StyledParagraph = styled(Paragraph)`
  font-weight: ${({ theme }) => theme.bold};
  font-size: ${({ theme }) => theme.fontSize.l};
  max-width: 450px;
  text-align: center;
  margin: 0 0 25px;
`;

const StyledLogo = styled.div`
  width: 180px;
  height: 180px;
  background: url(${logoIcon}) no-repeat center;
  background-size: 100%;
  margin: 0;
`;

const StyledErrorMsg = styled.p`
  margin: 15px 0 5px;
  color: hsl(4, 82%, 56%);
  padding-left: 15px;
  font-size: ${({ theme }) => theme.fontSize.xs};
`;

const AuthTemplate = ({ pageContext, authenticate, userID }) => {
  if (userID) return <Redirect to={routes.notes} />;
  return (
    <StyledWrapper>
      <StyledContentWrapper>
        <StyledLogo />
        <StyledParagraph>
          Your new favorite online notes memorable experience!
        </StyledParagraph>
        <StyledHeader>
          <StyledHeading as="h2">
            {pageContext === 'login' ? 'Sign in' : 'Sign up'}
          </StyledHeading>
          <Formik
            initialValues={{ email: '', username: '', password: '' }}
            validate={({ email, username, password }) => {
              const errors = {};
              if (!email && pageContext === 'register')
                errors.email = 'E-mail is required';
              if (!username) errors.username = 'Username is required';
              else if (
                pageContext === 'register' &&
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)
              ) {
                errors.email = 'Invalid email address';
              }
              if (!password) errors.password = 'Password is required';
              return errors;
            }}
            onSubmit={(
              { email, username, password },
              { setSubmitting, resetForm },
            ) => {
              setTimeout(() => {
                authenticate(email, username, password, pageContext);
                resetForm();
                setSubmitting(false);
              }, 1000);
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
            }) => (
              <Form onSubmit={handleSubmit}>
                {pageContext === 'register' && (
                  <>
                    <StyledErrorMsg>
                      {errors.email && touched.email && errors.email}
                    </StyledErrorMsg>
                    <StyledInput
                      type="text"
                      name="email"
                      placeholder="E-mail"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                      border={
                        touched.email && errors.email && 'hsl(4, 82%, 56%)'
                      }
                    />
                  </>
                )}
                <StyledErrorMsg>
                  {errors.username && touched.username && errors.username}
                </StyledErrorMsg>
                <StyledInput
                  type="text"
                  name="username"
                  placeholder="Username"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.username}
                  border={
                    touched.username && errors.username && 'hsl(4, 82%, 56%)'
                  }
                />
                <StyledErrorMsg>
                  {errors.password && touched.password && errors.password}
                </StyledErrorMsg>
                <StyledInput
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                  border={
                    touched.password && errors.password && 'hsl(4, 82%, 56%)'
                  }
                />
                <StyledButton type="submit" disabled={isSubmitting}>
                  {pageContext === 'login' ? 'Log in' : 'Register'}
                </StyledButton>
              </Form>
            )}
          </Formik>
          <StyledLink
            as={Link}
            to={pageContext === 'login' ? routes.register : routes.login}
          >
            {pageContext === 'login'
              ? 'I want to log in!'
              : 'I want my account!'}
          </StyledLink>
        </StyledHeader>
      </StyledContentWrapper>
    </StyledWrapper>
  );
};

AuthTemplate.propTypes = {
  pageContext: PropTypes.oneOf([
    'login',
    'register',
    'notes',
    'twitters',
    'articles',
  ]).isRequired,
  authenticate: PropTypes.func.isRequired,
  userID: PropTypes.string,
};

AuthTemplate.defaultProps = {
  userID: null,
};

const mapStateToProps = ({ userID = null }) => ({ userID });

const mapDispatchToProps = dispatch => ({
  authenticate: (email, username, password, pageContext) =>
    dispatch(authenticateAction(email, username, password, pageContext)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withContext(AuthTemplate));
