class Solution {
    public List<Boolean> checkIfPrerequisite(int numCourses, int[][] prerequisites, int[][] queries) {
        int n = numCourses;
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        int[] indeg = new int[n];
        for (int[] p : prerequisites) { adj.get(p[0]).add(p[1]); indeg[p[1]]++; }
        boolean[][] before = new boolean[n][n];             // before[v][u]: u comes before v
        Deque<Integer> q = new ArrayDeque<>();
        for (int i = 0; i < n; i++) if (indeg[i] == 0) q.offer(i);
        while (!q.isEmpty()) {
            int u = q.poll();
            for (int w : adj.get(u)) {
                before[w][u] = true;
                for (int x = 0; x < n; x++) if (before[u][x]) before[w][x] = true;   // hand down u's set
                if (--indeg[w] == 0) q.offer(w);
            }
        }
        List<Boolean> res = new ArrayList<>();
        for (int[] qu : queries) res.add(before[qu[1]][qu[0]]);
        return res;
    }
}
