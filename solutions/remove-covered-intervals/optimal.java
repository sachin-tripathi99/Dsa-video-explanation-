class Solution {
    public int removeCoveredIntervals(int[][] intervals) {
        Arrays.sort(intervals, (a, b) -> a[0] != b[0] ? Integer.compare(a[0], b[0]) : Integer.compare(b[1], a[1]));
        int kept = 0, maxEnd = Integer.MIN_VALUE;
        for (int[] iv : intervals) {
            if (iv[1] > maxEnd) {                       // sticks out → not covered
                kept++;
                maxEnd = iv[1];
            }
        }
        return kept;
    }
}
