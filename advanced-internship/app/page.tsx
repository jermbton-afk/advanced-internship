"use client";
import AiFillFileText from "./components/AiFillFileText";
import AiFillBulb from "./components/AiFillBulb";
import AiFillAudio from "./components/AiFillAudio";
import BsStarFill from "./components/BsStarFill";
import BiCrown from "./components/BiCrown";
import BsStarHalf from "./components/BsStarHalf";
import RiLeafLine from "./components/RiLeafLine";
import { Show, SignInButton, UserButton, useSignIn } from "@clerk/nextjs";
import { useState } from "react";

export default function Home() {
  const signInState = useSignIn();
  const [isGuestLoading, setIsGuestLoading] = useState(false);
  const [guestError, setGuestError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  async function guestLogin() {
    const signIn = signInState.signIn;

    if (!signIn || isGuestLoading) {
      return;
    }

    setIsGuestLoading(true);
    setGuestError(null);

    try {
      const response = await fetch("/api/guest", { method: "POST" });
      const result: {
        ticket?: string;
        error?: string;
        detail?: string;
        stage?: string;
        clerkErrors?: Array<{
          code?: unknown;
          message?: unknown;
          longMessage?: unknown;
        }>;
      } = await response.json();

      if (!response.ok || !result.ticket) {
        const clerkErrorMessage = result.clerkErrors?.[0]?.longMessage;
        throw new Error(
          (typeof clerkErrorMessage === "string" && clerkErrorMessage) ||
            result.detail ||
            result.error ||
            "Unable to start guest sign-in.",
        );
      }

      const { error: ticketError } = await signIn.ticket({
        ticket: result.ticket,
      });

      if (ticketError) {
        throw ticketError;
      }

      if (signIn.status !== "complete" || !signIn.createdSessionId) {
        throw new Error(
          `Clerk guest sign-in did not complete (status: ${signIn.status}).`,
        );
      }

      const { error: finalizeError } = await signIn.finalize();
      if (finalizeError) {
        throw finalizeError;
      }

      window.location.assign("/dashboard");
    } catch {
      setGuestError("Guest sign-in failed. Please try again.");
      setIsGuestLoading(false);
    }
  }

  return (
    <>
      <nav className="nav">
        <div className="nav__wrapper">
          <figure className="nav__img--mask">
            <img className="nav__img" src="./favicon.ico" alt="logo" />
          </figure>
          <ul className="nav__list--wrapper">
            <Show when="signed-out">
              <li>
                <SignInButton mode="modal" fallbackRedirectUrl="/">
                  <button type="button" className="nav__list nav__list--login">
                    Login
                  </button>
                </SignInButton>
              </li>
              <li>
                <button
                  type="button"
                  className="nav__list nav__list--login"
                  onClick={guestLogin}
                  disabled={isGuestLoading}
                >
                  {isGuestLoading ? "Signing in..." : "Guest"}
                </button>
              </li>
            </Show>
            <li className="nav__list nav__list--mobile">About</li>
            <li className="nav__list nav__list--mobile">Contact</li>
            <li className="nav__list nav__list--mobile">Help</li>
            <Show when="signed-in">
              <UserButton />
            </Show>
          </ul>
        </div>
      </nav>
      <section id="landing">
        <div className="container">
          <div className="row">
            <div className="landing__wrapper">
              <div className="landing__content">
                <div className="landing__content__title">
                  Gain more knowledge <br className="remove--tablet" />
                  in less time
                </div>
                <div className="landing__content__subtitle">
                  Great summaries for busy people,
                  <br className="remove--tablet" />
                  individuals who barely have time to read,
                  <br className="remove--tablet" />
                  and even people who don’t like to read.
                </div>
                <SignInButton mode="modal" fallbackRedirectUrl="/">
                  <button type="button" className="btn home__cta--btn">
                    Login
                  </button>
                </SignInButton>
              </div>
              <figure className="landing__image--mask">
                <img src="" alt="landing" />
              </figure>
            </div>
          </div>
        </div>
      </section>
      <section id="features">
        <div className="container">
          <div className="row">
            <div className="section__title">
              Understand books in few minutes
            </div>
            <div className="features__wrapper">
              <div className="features">
                <div className="features__icon">
                  <AiFillFileText />
                </div>
                <div className="features__title">Read or listen</div>
                <div className="features__sub--title">
                  Save time by getting the core ideas from the best books.
                </div>
              </div>
              <div className="features">
                <div className="features__icon">
                  <AiFillBulb />
                </div>
                <div className="features__title">Find your next read</div>
                <div className="features__sub--title">
                  Explore book lists and personalized recommendations.
                </div>
              </div>
              <div className="features">
                <div className="features__icon">
                  <AiFillAudio />
                </div>
                <div className="features__title">Briefcasts</div>
                <div className="features__sub--title">
                  Gain valuable insights from briefcasts
                </div>
              </div>
            </div>
            <div className="statistics__wrapper">
              <div className="statistics__content--header">
                <div className="statistics__heading">
                  Enhance your knowledge
                </div>
                <div className="statistics__heading">
                  Achieve greater success
                </div>
                <div className="statistics__heading">Improve your health</div>
                <div className="statistics__heading">
                  Develop better parenting skills
                </div>
                <div className="statistics__heading">Increase happiness</div>
                <div className="statistics__heading">
                  Be the best version of yourself!
                </div>
              </div>
              <div className="statistics__content--details">
                <div className="statistics__data">
                  <div className="statistics__data--number">93%</div>
                  <div className="statistics__data--title">
                    of Summarist members <b>significantly increase</b> reading
                    frequency.
                  </div>
                </div>
                <div className="statistics__data">
                  <div className="statistics__data--number">96%</div>
                  <div className="statistics__data--title">
                    of Summarist members <b>establish better</b> habits.
                  </div>
                </div>
                <div className="statistics__data">
                  <div className="statistics__data--number">90%</div>
                  <div className="statistics__data--title">
                    have made <b>significant positive</b> change to their lives.
                  </div>
                </div>
              </div>
            </div>
            <div className="statistics__wrapper">
              <div className="statistics__content--details statistics__content--details-second">
                <div className="statistics__data">
                  <div className="statistics__data--number">91%</div>
                  <div className="statistics__data--title">
                    of Summarist members <b>report feeling more productive</b>
                    {""} after incorporating the service into their daily
                    routine.
                  </div>
                </div>
                <div className="statistics__data">
                  <div className="statistics__data--number">94%</div>
                  <div className="statistics__data--title">
                    of Summarist members have <b>noticed an improvement</b> in
                    their overall comprehension and retention of information.
                  </div>
                </div>
                <div className="statistics__data">
                  <div className="statistics__data--number">88%</div>
                  <div className="statistics__data--title">
                    of Summarist members <b>feel more informed</b> about current
                    events and industry trends since using the platform.
                  </div>
                </div>
              </div>
              <div className="statistics__content--header statistics__content--header-second">
                <div className="statistics__heading">Expand your learning</div>
                <div className="statistics__heading">Accomplish your goals</div>
                <div className="statistics__heading">
                  Strengthen your vitality
                </div>
                <div className="statistics__heading">
                  Become a better caregiver
                </div>
                <div className="statistics__heading">Improve your mood</div>
                <div className="statistics__heading">
                  Maximize your abilities
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="reviews">
        <div className="row">
          <div className="container">
            <div className="section__title">What our members say</div>
            <div className="reviews__wrapper">
              <div className="review">
                <div className="review__header">
                  <div className="review__name">Hanna M.</div>
                  <div className="review__stars">
                    <BsStarFill />
                  </div>
                </div>
                <div className="review__body">
                  This app has been a <b>game-changer</b> for me! It's saved me
                  so much time and effort in reading and comprehending books.
                  Highly recommend it to all book lovers.
                </div>
              </div>
              <div className="review">
                <div className="review__header">
                  <div className="review__name">David B.</div>
                  <div className="review__stars">
                    <BsStarFill />
                  </div>
                </div>
                <div className="review__body">
                  I love this app! It provides
                  <b>concise and accurate summaries</b> of books in a way that
                  is easy to understand. It's also very user-friendly and
                  intuitive.
                </div>
              </div>
              <div className="review">
                <div className="review__header">
                  <div className="review__name">Nathan S.</div>
                  <div className="review__stars">
                    <BsStarFill />
                  </div>
                </div>
                <div className="review__body">
                  This app is a great way to get the main takeaways from a book
                  without having to read the entire thing.
                  <b>The summaries are well-written and informative.</b>
                  Definitely worth downloading.
                </div>
              </div>
              <div className="review">
                <div className="review__header">
                  <div className="review__name">Ryan R.</div>
                  <div className="review__stars">
                    <BsStarFill />
                  </div>
                </div>
                <div className="review__body">
                  If you're a busy person who
                  <b>loves reading but doesn't have the time</b> to read every
                  book in full, this app is for you! The summaries are thorough
                  and provide a great overview of the book's content.
                </div>
              </div>
            </div>
            <div className="reviews__btn--wrapper">
              <SignInButton mode="modal" fallbackRedirectUrl="/">
                <button type="button" className="btn home__cta--btn">
                  Login
                </button>
              </SignInButton>
            </div>
          </div>
        </div>
      </section>
      <section id="numbers">
        <div className="container">
          <div className="row">
            <div className="section__title">
              Start growing with Summarist now
            </div>
            <div className="numbers__wrapper">
              <div className="numbers">
                <div className="numbers__icon">
                  <BiCrown />
                </div>
                <div className="numbers__title">3 Million</div>
                <div className="numbers__sub--title">
                  Downloads on all platforms
                </div>
              </div>
              <div className="numbers">
                <div className="numbers__icon numbers__star--icon">
                  <BsStarFill />
                  <BsStarHalf />
                </div>
                <div className="numbers__title">4.5 Stars</div>
                <div className="numbers__sub--title">
                  Average ratings on iOS and Google Play
                </div>
              </div>
              <div className="numbers">
                <div className="numbers__icon">
                  <RiLeafLine />
                </div>
                <div className="numbers__title">97%</div>
                <div className="numbers__sub--title">
                  Of Summarist members create a better reading habit
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="footer">
        <div className="container">
          <div className="row">
            <div className="footer__top--wrapper">
              <div className="footer__block">
                <div className="footer__link--title">Actions</div>
                <div>
                  <div className="footer__link--wrapper">
                    <a className="footer__link">Summarist Magazine</a>
                  </div>
                  <div className="footer__link--wrapper">
                    <a className="footer__link">Cancel Subscription</a>
                  </div>
                  <div className="footer__link--wrapper">
                    <a className="footer__link">Help</a>
                  </div>
                  <div className="footer__link--wrapper">
                    <a className="footer__link">Contact us</a>
                  </div>
                </div>
              </div>
              <div className="footer__block">
                <div className="footer__link--title">Useful Links</div>
                <div>
                  <div className="footer__link--wrapper">
                    <a className="footer__link">Pricing</a>
                  </div>
                  <div className="footer__link--wrapper">
                    <a className="footer__link">Summarist Business</a>
                  </div>
                  <div className="footer__link--wrapper">
                    <a className="footer__link">Gift Cards</a>
                  </div>
                  <div className="footer__link--wrapper">
                    <a className="footer__link">Authors & Publishers</a>
                  </div>
                </div>
              </div>
              <div className="footer__block">
                <div className="footer__link--title">Company</div>
                <div>
                  <div className="footer__link--wrapper">
                    <a className="footer__link">About</a>
                  </div>
                  <div className="footer__link--wrapper">
                    <a className="footer__link">Careers</a>
                  </div>
                  <div className="footer__link--wrapper">
                    <a className="footer__link">Partners</a>
                  </div>
                  <div className="footer__link--wrapper">
                    <a className="footer__link">Code of Conduct</a>
                  </div>
                </div>
              </div>
              <div className="footer__block">
                <div className="footer__link--title">Other</div>
                <div>
                  <div className="footer__link--wrapper">
                    <a className="footer__link">Sitemap</a>
                  </div>
                  <div className="footer__link--wrapper">
                    <a className="footer__link">Legal Notice</a>
                  </div>
                  <div className="footer__link--wrapper">
                    <a className="footer__link">Terms of Service</a>
                  </div>
                  <div className="footer__link--wrapper">
                    <a className="footer__link">Privacy Policies</a>
                  </div>
                </div>
              </div>
            </div>
            <div className="footer__copyright--wrapper">
              <div className="footer__copyright">
                Copyright &copy; 2023 Summarist.
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
