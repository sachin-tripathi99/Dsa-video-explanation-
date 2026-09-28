class Solution {
    public int[] findOrder(int numCourses, int[][] prerequisites) {
        boolean[] taken = new boolean[numCourses];
        int[] order = new int[numCourses];
        for (int k = 0; k < numCourses; k++) {
            int pick = -1;
            for (int c = 0; c < numCourses && pick < 0; c++) {   // rescan every course
                if (taken[c]) continue;
                boolean ready = true;
                for (int[] p : prerequisites) if (p[0] == c && !taken[p[1]]) { ready = false; break; }
                if (ready) pick = c;
            }
            if (pick < 0) return new int[0];                // everything left waits on a cycle
            taken[pick] = true;
            order[k] = pick;
        }
        return order;
    }
}
