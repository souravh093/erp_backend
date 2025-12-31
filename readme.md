<!-- async function updateCourseProgress(enrollmentId: string, courseId: string) {
  const totalLessons = await prisma.courseLesson.count({
    where: { module: { milestone: { courseId } } },
  });

  const completedLessons = await prisma.lessonProgress.count({
    where: { enrollmentId, status: "COMPLETED" },
  });

  const progressPercent = (completedLessons / totalLessons) * 100;

  await prisma.courseEnrollment.update({
    where: { id: enrollmentId },
    data: { progress: progressPercent },
  });

  return progressPercent;
} -->


<!-- async function initializeLessonProgress(enrollmentId: string, courseId: string) {
  const lessons = await prisma.courseLesson.findMany({
    where: { module: { milestone: { courseId } } },
    orderBy: [
      { module: { milestone: { order: 'asc' } } },
      { module: { order: 'asc' } },
      { order: 'asc' },
    ],
    select: { id: true },
  });

  const progressData = lessons.map((lesson, index) => ({
    enrollmentId,
    lessonId: lesson.id,
    access: index === 0 ? "Unlocked" : "Locked", // 🔓 only the first one is open
  }));

  await prisma.lessonProgress.createMany({ data: progressData });
} -->



