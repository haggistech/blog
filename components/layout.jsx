import React from "react";
import Head from "next/head";
import Link from "next/link";
import { useCurrentUser } from "@/hooks/index";


export default function Layout({ children }) {
  const [user, { mutate }] = useCurrentUser();
  const handleLogout = async () => {
    await fetch("/api/auth", {
      method: "DELETE",
    });
    mutate(null);
  };
  return (
    <>
      <style jsx global>
        {`
          a {
            text-decoration: none !important;
            cursor: pointer;
            color: #0070f3;
          }
          a:hover {
            color: #0366d6;
          }
          body {
            margin: 0;
            padding: 0;
            color: #111;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
              "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
              "Helvetica Neue", sans-serif;
            background-color: #f1f1f1;
            background: #f1f1f1;
            box-sizing: border-box;
          }

          /* Footer */
          /* Set black background color, white text and some padding */
          footer {
            background-color: #333;
            color: white;
            padding: 15px;
          }
          h2 {
            color: #333;
            text-align: center;
          }
          label {
            display: flex;
            margin-bottom: 0.5rem;
            align-items: center;
            width: 100%;
          }
          form {
            margin-bottom: 0.5rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
          input,
          textarea {
            font-family: monospace;
            flex: 1 1 0%;
            margin-left: 0.5rem;
            box-shadow: none;
            width: 100%;
            color: #000;
            background-color: transparent;
            border: 1px solid #d8d8d8;
            border-radius: 5px;
            outline: 0px;
            padding: 10px 25px;
          }
          button {
            display: block;
            margin-bottom: 0.5rem;
            color: #fff;
            border-radius: 5px;
            border: none;
            background-color: #000;
            cursor: pointer;
            transition: all 0.2s ease 0s;
            padding: 10px 25px;
            box-shadow: 0 5px 10px rgba(0, 0, 0, 0.12);
          }
          button:hover,
          button:active {
            transform: translate3d(0px, -1px, 0px);
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
          }
          header {
            border-bottom: 1px solid #d8d8d8;
          }
          .hero-image {
            /* Use "linear-gradient" to add a darken background effect to the image (photographer.jpg). This will make the text easier to read */
            background-image: linear-gradient(
                rgba(0, 0, 0, 0.5),
                rgba(0, 0, 0, 0.5)
              ),
              url("header.png");

            /* Set a specific height */
            height: 300px;

            /* Position and center the image to scale nicely on all screens */
            background-position: center;
            background-repeat: no-repeat;
            background-size: cover;
            position: relative;
          }
          .hero-text {
            text-align: center;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
          }
          .navbar {
            margin-bottom: 0;
            border-radius: 0;
          }
          main {
            padding: 1rem;
            max-width: 1040px;
            margin: 0 auto;
          }

          .circle {
            width: 50px;
            height: 50px;
            line-height: 50px;
            font-size: 20px;
            color: #fff;
            text-align: center;
            background: #000;
          }
          .btn-social-icon.btn-lg :first-child {
            line-height: 45px;
            width: 45px;
            font-size: 1.8em;
          }
          .btn-social-icon :first-child {
            border: none;
            text-align: center;
            width: 100% !important;
          }
          .btn-social-icon :first-child {
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 32px;
            line-height: 34px;
            font-size: 1.6em;
            border-right: 1px solid rgba(0, 0, 0, 0.2);
          }
          .fa {
            display: inline-block;
            text-rendering: auto;
            color: #fff;
          }

          .fa:hover {
            display: inline-block;
            text-rendering: auto;
            color: darkgrey;
          }
          .fa {
            display: inline-block;
            font: normal normal normal 14px/1 FontAwesome;
            font-size: inherit;
            text-rendering: auto;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
        `}
      </style>
      <Head>
        <title>Miks Blog</title>
        <meta
          key="viewport"
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <meta property="og:title" content="Miks Blog" />
        <meta
          property="og:description"
          content="nextjs-mongodb-app is a continously developed app built with Next.JS and MongoDB. This project goes further and attempts to integrate top features as seen in real-life apps."
        />
        <meta
          property="og:image"
          content="https://repository-images.githubusercontent.com/201392697/5d392300-eef3-11e9-8e20-53310193fbfd"
        />
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css "
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        />
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
        <script
          src="https://kit.fontawesome.com/df5286e006.js"
          crossOrigin="anonymous"
        ></script>
      </Head>
      <header>
        <nav class="navbar navbar-inverse">
          <div class="container-fluid">
            <div class="navbar-header">
              <button
                type="button"
                class="navbar-toggle"
                data-toggle="collapse"
                data-target="#myNavbar"
              >
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
              </button>
              <div class="circle">
                MB<a class="navbar-brand" href="#"></a>
              </div>
            </div>
            <div class="collapse navbar-collapse" id="myNavbar">
              <ul class="nav navbar-nav">
                <li class="active">
                  <a href="#">Home</a>
                </li>
                <li>
                  <a href="#">About</a>
                </li>
                <li>
                  <a href="#">Contact</a>
                </li>
              </ul>
              <ul class="nav navbar-nav navbar-right">
                {!user ? (
                  <>
                    <Link href="/login">
                      <li>
                        <a href="#">
                          <span class="glyphicon glyphicon-log-in"></span> Login
                        </a>
                      </li>
                    </Link>

                    <Link href="/signup">
                      <li>
                        <a>
                          <span class="far fa-id-card"></span> Sign up
                        </a>
                      </li>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href={`/user/${user._id}`}>
                      <li>
                        <a>
                          <img
                            width="20"
                            height="20"
                            style={{
                              borderRadius: "20%",
                              objectFit: "cover",
                              marginRight: "0.5rem",
                            }}
                            src={user.profilePicture}
                            alt={user.name}
                          />
                          {user.name}
                        </a>
                      </li>
                    </Link>
                    &nbsp;&nbsp;&nbsp;|<i class="fas fa-user-cog"></i>
                    <Link href={`#`}>
                      <li>
                        <a>{user.usergroup} menu</a>
                      </li>
                    </Link>
                    &nbsp;&nbsp;&nbsp;|
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <li>
                      <a tabIndex={0} role="button" onClick={handleLogout}>
                        <span class="glyphicon glyphicon-log-out"></span> Logout
                      </a>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </nav>
        <div class="hero-image"></div>
      </header>

      <main>{children}</main>
      <footer class="container-fluid text-center">
        <br />
      <a
            class="btn btn-lg btn-social-icon btn-facebook"
            href=""
            title="Facebook"
            rel="nofollow"
          >
            <span class="fa fa-facebook"></span>
          </a>

          <a
            class="btn btn-lg btn-social-icon btn-twitter"
            href=""
            title="Twitter"
            rel="nofollow"
          >
            <span class="fa fa-twitter"></span>
          </a>

          <a
            class="btn btn-lg btn-social-icon btn-github"
            href=""
            title="Github"
            rel="nofollow"
          >
            <span class="fa fa-github"></span>
          </a>

          <a
            class="btn btn-lg btn-social-icon btn-google"
            href=""
            title="Google"
            rel="nofollow"
          >
            <span class="fa fa-google"></span>
          </a>

          <a
            class="btn btn-lg btn-social-icon btn-microsoft"
            href=""
            title="Microsoft"
            rel="nofollow"
          >
            <span class="fa fa-windows"></span>
          </a>
      </footer>
    </>
  );
}
