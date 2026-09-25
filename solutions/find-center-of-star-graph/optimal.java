class Solution {
    public int findCenter(int[][] edges) {
        int a = edges[0][0], b = edges[0][1];
        return (a == edges[1][0] || a == edges[1][1]) ? a : b;   // the shared node
    }
}
