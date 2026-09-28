class Solution {
    public List<Boolean> checkIfPrerequisite(int numCourses, int[][] prerequisites, int[][] queries) {
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < numCourses; i++) adj.add(new ArrayList<>());
        for (int[] p : prerequisites) adj.get(p[0]).add(p[1]);
        List<Boolean> res = new ArrayList<>();
        for (int[] q : queries)                             // a fresh search per query
            res.add(reach(adj, q[0], q[1], new boolean[numCourses]));
        return res;
    }

    private boolean reach(List<List<Integer>> adj, int u, int target, boolean[] seen) {
        if (u == target) return true;
        seen[u] = true;
        for (int w : adj.get(u)) if (!seen[w] && reach(adj, w, target, seen)) return true;
        return false;
    }
}
