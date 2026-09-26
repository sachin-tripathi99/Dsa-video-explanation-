class Solution {
    public int eraseOverlapIntervals(int[][] intervals) {
        int n = intervals.length, best = 0;
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
        int[] keep = new int[n];
        for (int i = 0; i < n; i++) {
            keep[i] = 1;
            for (int j = 0; j < i; j++)
                if (intervals[j][1] <= intervals[i][0]) keep[i] = Math.max(keep[i], keep[j] + 1);
            best = Math.max(best, keep[i]);
        }
        return n - best;
    }
}
