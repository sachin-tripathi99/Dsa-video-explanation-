class Solution {
    public int minGroups(int[][] intervals) {
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
        PriorityQueue<Integer> ends = new PriorityQueue<>();   // end time of each group
        for (int[] iv : intervals) {
            if (!ends.isEmpty() && ends.peek() < iv[0]) ends.poll();   // reuse the group that frees first
            ends.offer(iv[1]);
        }
        return ends.size();
    }
}
