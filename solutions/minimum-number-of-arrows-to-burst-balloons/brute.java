class Solution {
    public int findMinArrowShots(int[][] points) {
        int n = points.length, arrows = 0;
        boolean[] burst = new boolean[n];
        while (true) {
            int b = -1;
            for (int i = 0; i < n; i++)                       // intact balloon ending first
                if (!burst[i] && (b == -1 || points[i][1] < points[b][1])) b = i;
            if (b == -1) return arrows;
            arrows++;
            long x = points[b][1];
            for (int i = 0; i < n; i++)
                if (points[i][0] <= x && x <= points[i][1]) burst[i] = true;
        }
    }
}
