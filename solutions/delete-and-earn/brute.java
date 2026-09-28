class Solution {
    public int deleteAndEarn(int[] nums) {
        int max = 0;
        for (int x : nums) max = Math.max(max, x);
        int[] pts = new int[max + 1];
        for (int x : nums) pts[x] += x;                     // bucket points by value
        return best(pts, max);
    }

    private int best(int[] pts, int x) {                    // best using values 0..x
        if (x < 0) return 0;
        return Math.max(best(pts, x - 1), best(pts, x - 2) + pts[x]);
    }
}
