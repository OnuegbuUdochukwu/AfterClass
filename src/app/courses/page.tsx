import { redirect } from "next/navigation";
import CourseCard from "@/components/CourseCard";
import { getAuthenticatedUser, getEnrolledCourses } from "./data";

export default async function CoursesPage() {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/login");

  const courses = await getEnrolledCourses(user.id);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 pb-12 pt-24 sm:px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Course Lobby
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          Choose a course to open its weekly timeline and latest lecture notes.
        </p>
      </header>

      {courses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            You are not enrolled in any courses yet.
          </p>
        </div>
      ) : (
        <section className="grid gap-4 sm:grid-cols-2">
          {courses
            .sort((a, b) => a.code.localeCompare(b.code))
            .map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
        </section>
      )}
    </div>
  );
}
