import React, { useState } from "react";
import { useCurrentUser, adminUser } from "@/hooks/index";

export default function PostEditor({ edit, makeEdit, title, text, postImage, Id }) {
  const [user] = useCurrentUser();

  const [msg, setMsg] = useState(null);

  if (!user) {
    return (
      <div style={{ color: "#555", textAlign: "center" }}>
        You need to Register or Sign In to post comments!
      </div>
    );
  }
  const discard = () => {
    makeEdit();
  };

  if (user.usergroup != "Admin") {
    return <div></div>;
  }

  async function hanldeSubmit(e) {
    e.preventDefault();
    if (edit === true) {
      const body = {
        title: e.currentTarget.title.value,
        content: e.currentTarget.content.value,
        postImage: e.currentTarget.postImage.value,
        postId: Id,
      };
      // if (!e.currentTarget.content.value) return;
      const res = await fetch("/api/posts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        makeEdit("Edited!", body.content);
      } else {
        makeEdit(res.text(), text);
      }
    } else {
      const body = {
        title: e.currentTarget.title.value,
        content: e.currentTarget.content.value,
        postImage: e.currentTarget.postImage.value,
      };
      if (!e.currentTarget.content.value) return;
      e.currentTarget.content.value = "";
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setMsg("Posted!");
        window.location.reload( false );
        setTimeout(() => setMsg(null), 5000);
      }
    }
  }

  return (
    <>
      <p style={{ color: "#0070f3", textAlign: "center" }}>{msg}</p>
      <form
        onSubmit={hanldeSubmit}
        onReset={discard}
        style={{ flexDirection: 'row' }}
        autoComplete="off">

        {edit === true ? (
                  <label htmlFor="name">
            <input name="title" type="text" placeholder={title} defaultValue={title} />
            <input name="content" type="text" placeholder={text} defaultValue={text} />
            <input name="postImage" type="text" placeholder={postImage} defaultValue={postImage} />
            </label>
          ) : (
            <label htmlFor="name">
            <input name="title" type="text" placeholder="Enter a Title" />
            <input name="content" type="text" placeholder="Say something, I'm giving up on you..." />
            <input name="postImage" type="text" placeholder="Image URL" />
            </label>
          )}

        <button type="submit" style={{ marginLeft: "0.5rem" }}>
          {edit === true ? "Update" : "Post"}
        </button>
        {edit === true ? (
          <button type="reset" style={{ marginLeft: "0.5rem", backgroundColor: "white", color: "black" }}>
            Discard
          </button>
        ) : null}
      </form>
    </>
  );
}
