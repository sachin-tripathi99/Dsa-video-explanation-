class Solution {
    public int eraseOverlapIntervals(int[][] intervals) {
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));   // by end
        int removed = 0;
        long end = Long.MIN_VALUE;
        for (int[] iv : intervals) {
            if (iv[0] >= end) end = iv[1];              // keep
            else removed++;                             // overlaps the kept set
        }
        return removed;
    }
}
