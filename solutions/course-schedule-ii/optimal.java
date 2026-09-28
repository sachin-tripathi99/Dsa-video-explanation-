class Solution {
    public int[] findOrder(int numCourses, int[][] prerequisites) {
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < numCourses; i++) adj.add(new ArrayList<>());
        int[] indeg = new int[numCourses];
        for (int[] p : prerequisites) { adj.get(p[1]).add(p[0]); indeg[p[0]]++; }
        Deque<Integer> q = new ArrayDeque<>();
        for (int c = 0; c < numCourses; c++) if (indeg[c] == 0) q.offer(c);
        int[] order = new int[numCourses];
        int k = 0;
        while (!q.isEmpty()) {
            int c = q.poll();
            order[k++] = c;                                 // pop order = schedule
            for (int next : adj.get(c)) if (--indeg[next] == 0) q.offer(next);
        }
        return k == numCourses ? order : new int[0];
    }
}
