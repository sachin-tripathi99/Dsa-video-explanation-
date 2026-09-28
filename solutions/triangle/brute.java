class Solution {
    public int minimumTotal(List<List<Integer>> triangle) {
        return best(triangle, 0, 0);
    }

    private int best(List<List<Integer>> t, int r, int c) {
        int here = t.get(r).get(c);
        if (r == t.size() - 1) return here;                 // bottom row
        return here + Math.min(best(t, r + 1, c), best(t, r + 1, c + 1));
    }
}
