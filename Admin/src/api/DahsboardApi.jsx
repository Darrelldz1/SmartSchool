import api from "./axios";

export const getDashboardStats = async () => {
  const [students, teachers, news, gallery] = await Promise.all([
    api.get("/students"),
    api.get("/teachers"),
    api.get("/news"),
    api.get("/gallery"),
  ]);

  return {
    students: students.data.length,
    teachers: teachers.data.length,
    news: news.data.length,
    gallery: gallery.data.length,
  };
};
