class Solution {
    public int findMinArrowShots(int[][] points) {
        Arrays.sort(points, (a, b) -> Integer.compare(a[1], b[1]));   // by end
        int arrows = 0;
        long x = Long.MIN_VALUE;
        for (int[] p : points) {
            if (p[0] > x) {                             // still intact → new arrow at its end
                arrows++;
                x = p[1];
            }
        }
        return arrows;
    }
}
