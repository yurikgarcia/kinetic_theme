import React, { useState, FormEventHandler } from "react";
import { clsx } from "keycloakify/tools/clsx";
import { useConstCallback } from "keycloakify/tools/useConstCallback";
import { PageProps } from "keycloakify/login/pages/PageProps";
import { useGetClassName } from "keycloakify/login/lib/useGetClassName";
import kineticLogoBlack from "../assets/kinetic_logo_black.svg";
import styles from "./LoginStyles.module.css";

const customStyles = `
  .customTemplateClass {
    background-color: green;
  }
  .kcFormGroupClass + .kcFormGroupClass {
    margin-top: 30px;
  }
  .formGroup {
    display: flex;
    flex-direction: column;
    align-items: flex-start; /* Align items to the left */
    margin-bottom: 20px;
  }
  .formGroup label {
    margin-bottom: 5px;
  }
  .inputStyle {
    display: flex;
    flex-direction: column;
    align-items: center; /* Align labels and inputs to the left */
    width: 100%; /* Ensure inputs take full width */
  }
  .inputStyle label {
    margin-bottom: 5px;
    font-weight: bold; /* Optionally make labels bold */
  }
`;

const Login = (
  props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>
) => {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
  const { getClassName } = useGetClassName({ doUseDefaultCss, classes });

  const {
    social,
    realm,
    url,
    usernameHidden,
    login,
    auth,
    registrationDisabled,
  } = kcContext;
  const { msg, msgStr } = i18n;

  const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);

  const onSubmit: FormEventHandler<HTMLFormElement> = useConstCallback((e) => {
    e.preventDefault();
    setIsLoginButtonDisabled(true);
    const formElement = e.target as HTMLFormElement;
    formElement
      .querySelector("input[name='email']")
      ?.setAttribute("name", "username");
    formElement.submit();
  });

  return (
    <Template
      {...{ kcContext, i18n, doUseDefaultCss, classes }}
      displayInfo={
        realm.password && realm.registrationAllowed && !registrationDisabled
      }
      displayWide={realm.password && social.providers !== undefined}
      headerNode={msg("doLogIn")}
      infoNode={
        <div id="kc-registration">
          <span>
            {msg("noAccount")}
            <a tabIndex={6} href={url.registrationUrl}>
              {msg("doRegister")}
            </a>
          </span>
        </div>
      }
    >
      <style>{customStyles}</style>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "42px",
        }}
      >
        <img src={kineticLogoBlack} alt="Kinetic Logo" />
      </div>

      <div
        id="kc-form"
        className={clsx(
          realm.password &&
            social.providers !== undefined &&
            getClassName("kcContentWrapperClass")
        )}
      >
        <div
          id="kc-form-wrapper"
          className={clsx(
            realm.password &&
              social.providers && [
                getClassName("kcFormSocialAccountContentClass"),
                getClassName("kcFormSocialAccountClass"),
              ]
          )}
        >
          {realm.password && (
            <form
              id="kc-form-login"
              onSubmit={onSubmit}
              action={url.loginAction}
              method="post"
            >
              <div
                className={clsx(getClassName("kcFormGroupClass"), "formGroup")}
              >
                {!usernameHidden &&
                  (() => {
                    const label = !realm.loginWithEmailAllowed
                      ? "username"
                      : realm.registrationEmailAsUsername
                        ? "email"
                        : "usernameOrEmail";
                    const autoCompleteHelper: typeof label =
                      label === "usernameOrEmail" ? "username" : label;
                    return (
                      <div className="inputStyle">
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <label
                            htmlFor={autoCompleteHelper}
                            className={styles.questrialRegular}
                          >
                            USERNAME
                          </label>
                          <input
                            tabIndex={1}
                            id={autoCompleteHelper}
                            className={styles.inputBoxes}
                            name={autoCompleteHelper}
                            defaultValue={login.username ?? ""}
                            type="text"
                            autoFocus={true}
                            autoComplete="off"
                          />
                        </div>
                      </div>
                    );
                  })()}
              </div>

              <div
                className={clsx(getClassName("kcFormGroupClass"), "formGroup")}
              >
                <div className="inputStyle">
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <label
                      htmlFor="password"
                      className={styles.questrialRegular}
                    >
                      PASSWORD
                    </label>
                    <input
                      tabIndex={2}
                      id="password"
                      className={styles.inputBoxes}
                      name="password"
                      type="password"
                      autoComplete="off"
                    />
                  </div>
                  <input
                    type="hidden"
                    id="id-hidden-input"
                    name="credentialId"
                    {...(auth?.selectedCredential !== undefined
                      ? { value: auth.selectedCredential }
                      : {})}
                  />
                  {/* THIS IS THE LOGIN BUTTON */}
                  <div
                    id="kc-form-buttons"
                    className={clsx(
                      getClassName("kcFormGroupClass"),
                      "formGroup",
                      styles.formGroupButtons // Adjusted for button alignment
                    )}
                  >
                    <input
                      tabIndex={4}
                      className={clsx(
                        getClassName("kcButtonClass"),
                        getClassName("kcButtonPrimaryClass"),
                        getClassName("kcButtonLargeClass"),
                        styles.loginButton
                      )}
                      name="login"
                      id="kc-login"
                      type="submit"
                      value="LOG IN"
                      disabled={isLoginButtonDisabled}
                    />
                    {/* RESET PASSWORD and CREATE ACCOUNT links */}
                    <div style={{ display: 'flex', alignItems: 'center', width: '530px'}}>
                      {/* RESET PASSWORD LINK */}
                      {realm.resetPasswordAllowed && (
                        <div className={styles.accountHelpers}>
                          <span>
                            <a
                              tabIndex={5}
                              href={url.loginResetCredentialsUrl}
                              className={styles.accountHelpers}
                            >
                              RESET PASSWORD
                            </a>
                          </span>
                        </div>
                      )}
                      {/* CREATE ACCOUNT link */}
                      {realm.registrationAllowed && !registrationDisabled && (
                        <div className={styles.accountHelpers} style={{ marginLeft: 'auto' }}>
                          <span>
                            <a
                              tabIndex={6}
                              href={url.registrationUrl}
                              className={styles.accountHelpers}
                            >
                              CREATE ACCOUNT
                            </a>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </Template>
  );
};

export default Login;
