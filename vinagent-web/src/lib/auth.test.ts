import { beforeEach, describe, expect, it } from "vitest";

import {
  getCurrentStudent,
  getStudentById,
  loginAccount,
  logoutAccount,
  verifyCurrentStudent,
} from "./auth";

describe("auth login flows", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("logs in directly with valid student id and name", () => {
    const result = loginAccount("20210001", "Nguyễn Văn An");
    expect(result.ok).toBe(true);

    const student = getCurrentStudent();
    expect(student?.id).toBe("20210001");
  });

  it("logs in other students from student.json", () => {
    const result = loginAccount("20210042", "Trần Minh Đức");
    expect(result.ok).toBe(true);
    expect(getCurrentStudent()?.id).toBe("20210042");
  });

  it("fails login with wrong student name", () => {
    const result = loginAccount("20210001", "wrong-name");
    expect(result.ok).toBe(false);
    expect(result.message).toMatch(/Họ tên không khớp/i);
  });

  it("allows register/login with non-accented name input", () => {
    const loginResult = loginAccount("20210001", "Nguyen Van An");
    expect(loginResult.ok).toBe(true);
  });

  it("fails login with unknown student id", () => {
    const result = loginAccount("unknown-id", "Nguyễn Văn An");
    expect(result.ok).toBe(false);
    expect(result.message).toMatch(/không tồn tại/i);
  });

  it("verifies current logged-in student against source data", () => {
    loginAccount("20210001", "Nguyễn Văn An");

    const result = verifyCurrentStudent();
    expect(result.ok).toBe(true);
  });

  it("clears session on logout", () => {
    loginAccount("20210001", "Nguyễn Văn An");

    logoutAccount();
    expect(getCurrentStudent()).toBeNull();
  });

  it("can find student from mock source", () => {
    const student = getStudentById("20210001");
    expect(student).not.toBeNull();
    expect(student?.name).toBe("Nguyễn Văn An");
  });
});
