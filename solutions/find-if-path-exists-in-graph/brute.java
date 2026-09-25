class Solution {
    public boolean validPath(int n, int[][] edges, int source, int destination) {
        boolean[] reached = new boolean[n];
        reached[source] = true;
        boolean changed = true;
        while (changed) {                       // at most n sweeps
            changed = false;
            for (int[] e : edges) {
                if (reached[e[0]] != reached[e[1]]) {
                    reached[e[0]] = reached[e[1]] = true;
                    changed = true;
                }
            }
        }
        return reached[destination];
    }
}
