class Solution {
    public int minGroups(int[][] intervals) {
        int best = 0;
        for (int[] a : intervals) {
            int c = 0;
            for (int[] b : intervals) if (b[0] <= a[0] && a[0] <= b[1]) c++;   // intervals containing a's start
            best = Math.max(best, c);
        }
        return best;
    }
}
