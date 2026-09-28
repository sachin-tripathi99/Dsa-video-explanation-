class Solution {
    public boolean canFinish(int numCourses, int[][] prerequisites) {
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < numCourses; i++) adj.add(new ArrayList<>());
        for (int[] p : prerequisites) adj.get(p[1]).add(p[0]);
        for (int s = 0; s < numCourses; s++)                // a fresh search from every course
            if (loops(adj, s, new boolean[numCourses])) return false;
        return true;
    }

    private boolean loops(List<List<Integer>> adj, int u, boolean[] onPath) {
        if (onPath[u]) return true;                         // came back to the current path
        onPath[u] = true;
        for (int w : adj.get(u)) if (loops(adj, w, onPath)) return true;
        onPath[u] = false;
        return false;
    }
}
