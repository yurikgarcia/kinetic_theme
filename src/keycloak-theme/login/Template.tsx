import { useState, useEffect } from "react";
import { assert } from "keycloakify/tools/assert";
import { clsx } from "keycloakify/tools/clsx";
import { usePrepareTemplate } from "keycloakify/lib/usePrepareTemplate";
import { type TemplateProps } from "keycloakify/login/TemplateProps";
import { useGetClassName } from "keycloakify/login/lib/useGetClassName";
import type { KcContext } from "./kcContext";
import type { I18n } from "./i18n";
import darkModeIcon from "./assets/darkMode.svg";
import lightModeIcon from "./assets/lightMode.svg";
import helpLight from "./assets/helpLight.svg";
import styles from "../../keycloak-theme/login/pages/LoginStyles.module.css";
import useWindowSize from "../customWindow";
// import keycloakifyLogoPngUrl from "./assets/keycloakify-logo.png";

export default function Template(props: TemplateProps<KcContext, I18n>) {
  const isMobile = useWindowSize();

  useEffect(() => {
    console.log("isMobile:", isMobile); // Log the value of isMobile
  }, [isMobile]);

  const [darkModeOn, setDarkModeOn] = useState(false);

  const toggleDarkMode = () => {
    setDarkModeOn(!darkModeOn);
  };

  const {
    // displayInfo = false,
    displayMessage = true,
    displayRequiredFields = false,
    displayWide = false,
    showAnotherWayIfPresent = true,
    headerNode,
    showUsernameNode = null,
    // infoNode = null,
    kcContext,
    i18n,
    doUseDefaultCss,
    classes,
    children,
  } = props;

  const { getClassName } = useGetClassName({ doUseDefaultCss, classes });

  // const { msg, changeLocale, labelBySupportedLanguageTag, currentLanguageTag } =
  //   i18n;

  const { msg } = i18n;

  const { realm, locale, auth, url, message, isAppInitiatedAction } = kcContext;

  const { isReady } = usePrepareTemplate({
    doFetchDefaultThemeResources: doUseDefaultCss,
    styles: [
      `${url.resourcesCommonPath}/node_modules/patternfly/dist/css/patternfly.min.css`,
      `${url.resourcesCommonPath}/node_modules/patternfly/dist/css/patternfly-additions.min.css`,
      `${url.resourcesCommonPath}/lib/zocial/zocial.css`,
      `${url.resourcesPath}/css/login.css`,
    ],
    htmlClassName: getClassName("kcHtmlClass"),
    bodyClassName: getClassName("kcBodyClass"),
    htmlLangProperty: locale?.currentLanguageTag,
    documentTitle: i18n.msgStr("loginTitle", kcContext.realm.displayName),
  });

  useEffect(() => {
    console.log(
      `Value of MY_ENV_VARIABLE on the Keycloak server: "${kcContext.properties.MY_ENV_VARIABLE}"`
    );
  }, []);

  if (!isReady) {
    return null;
  }

  const formCardStyle: React.CSSProperties = {
    backgroundColor: "#F5F5F5",
    borderRadius: "8px 8px 0 0",
    boxShadow: "20px 20px 50px 0 rgba(0, 0, 0, 0.2)",
    height: isMobile ? "550px" : "675px",
    width: isMobile ? "405px" : "710px",
    position: "absolute",
    top: isMobile ? "40%" : "50%", // Adjust top position for mobile
    left: "50%",
    transform: "translate(-50%, -50%)",
  };

  return (
    <div className={getClassName("kcLoginClass")}>
      {/* Dark Mode icon */}
      <button className={styles.darkModeButton} onClick={toggleDarkMode}>
        <img
          className={styles.darkModeIcon}
          src={darkModeOn ? lightModeIcon : darkModeIcon}
          alt={darkModeOn ? "Light Mode" : "Dark Mode"}
        />
      </button>
      {/* Helper Light button */}
      <button className={styles.helperButton}>
        <img className={styles.helpIcon} src={helpLight} alt="Helper Light" />
      </button>
      <div
        className={clsx(displayWide && getClassName("kcFormCardAccountClass"))}
        style={formCardStyle}
      >
        <header className={getClassName("kcFormHeaderClass")}>
          {/* top right */}

          {realm.internationalizationEnabled &&
            (assert(locale !== undefined), true) &&
            locale.supported.length > 1 && (
              <div id="kc-locale">
                {/* <div id="kc-locale-wrapper" className={getClassName("kcLocaleWrapperClass")}>
                                <div className="kc-dropdown" id="kc-locale-dropdown">
                                    <a href="#" id="kc-current-locale-link">
                                        {labelBySupportedLanguageTag[currentLanguageTag]}
                                    </a>
                                    <ul>
                                        {locale.supported.map(({ languageTag }) => (
                                            <li key={languageTag} className="kc-dropdown-item">
                                                <a href="#" onClick={() => changeLocale(languageTag)}>
                                                    {labelBySupportedLanguageTag[languageTag]}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div> */}
              </div>
            )}
          {!(
            auth !== undefined &&
            auth.showUsername &&
            !auth.showResetCredentials
          ) ? (
            displayRequiredFields ? (
              <div className={getClassName("kcContentWrapperClass")}>
                <div
                  className={clsx(
                    getClassName("kcLabelWrapperClass"),
                    "subtitle"
                  )}
                >
                  <span className="subtitle">
                    <span className="required">*</span>
                    {msg("requiredFields")}
                  </span>
                </div>
                <div className="col-md-10">
                  <h1 id="kc-page-title">{headerNode}</h1>
                </div>
              </div>
            ) : (
              <h1 id="kc-page-title">{headerNode}</h1>
            )
          ) : displayRequiredFields ? (
            <div className={getClassName("kcContentWrapperClass")}>
              <div
                className={clsx(
                  getClassName("kcLabelWrapperClass"),
                  "subtitle"
                )}
              >
                <span className="subtitle">
                  <span className="required">*</span> {msg("requiredFields")}
                </span>
              </div>
              <div className="col-md-10">
                {showUsernameNode}
                <div className={getClassName("kcFormGroupClass")}>
                  <div id="kc-username">
                    <label id="kc-attempted-username">
                      {auth?.attemptedUsername}
                    </label>
                    <a id="reset-login" href={url.loginRestartFlowUrl}>
                      <div className="kc-login-tooltip">
                        <i className={getClassName("kcResetFlowIcon")}></i>
                        <span className="kc-tooltip-text">
                          {msg("restartLoginTooltip")}
                        </span>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {showUsernameNode}
              <div className={getClassName("kcFormGroupClass")}>
                <div id="kc-username">
                  <label id="kc-attempted-username">
                    {auth?.attemptedUsername}
                  </label>
                  <a id="reset-login" href={url.loginRestartFlowUrl}>
                    <div className="kc-login-tooltip">
                      <i className={getClassName("kcResetFlowIcon")}></i>
                      <span className="kc-tooltip-text">
                        {msg("restartLoginTooltip")}
                      </span>
                    </div>
                  </a>
                </div>
              </div>
            </>
          )}
        </header>
        <div id="kc-content">
          <div id="kc-content-wrapper">
            {/* App-initiated actions should not see warning messages about the need to complete the action during login. */}
            {displayMessage &&
              message !== undefined &&
              (message.type !== "warning" || !isAppInitiatedAction) && (
                <div className={clsx("alert", `alert-${message.type}`)}>
                  {message.type === "success" && (
                    <span
                      className={getClassName("kcFeedbackSuccessIcon")}
                    ></span>
                  )}
                  {message.type === "warning" && (
                    <span
                      className={getClassName("kcFeedbackWarningIcon")}
                    ></span>
                  )}
                  {message.type === "error" && (
                    <span
                      className={getClassName("kcFeedbackErrorIcon")}
                    ></span>
                  )}
                  {message.type === "info" && (
                    <span className={getClassName("kcFeedbackInfoIcon")}></span>
                  )}
                  <span
                    className="kc-feedback-text"
                    dangerouslySetInnerHTML={{
                      __html: message.summary,
                    }}
                  />
                </div>
              )}
            {children}

            {auth !== undefined &&
              auth.showTryAnotherWayLink &&
              showAnotherWayIfPresent && (
                <form
                  id="kc-select-try-another-way-form"
                  action={url.loginAction}
                  method="post"
                  className={clsx(
                    displayWide && getClassName("kcContentWrapperClass")
                  )}
                >
                  <div
                    className={clsx(
                      displayWide && [
                        getClassName("kcFormSocialAccountContentClass"),
                        getClassName("kcFormSocialAccountClass"),
                      ]
                    )}
                  >
                    <div className={getClassName("kcFormGroupClass")}>
                      <input type="hidden" name="tryAnotherWay" value="on" />
                      <a
                        href="#"
                        id="try-another-way"
                        onClick={() => {
                          document.forms[
                            "kc-select-try-another-way-form" as never
                          ].submit();
                          return false;
                        }}
                      >
                        {msg("doTryAnotherWay")}
                      </a>
                    </div>
                  </div>
                </form>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
