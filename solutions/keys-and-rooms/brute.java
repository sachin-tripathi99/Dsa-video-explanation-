class Solution {
    public boolean canVisitAllRooms(List<List<Integer>> rooms) {
        int n = rooms.size();
        boolean[] open = new boolean[n];
        open[0] = true;
        boolean changed = true;
        while (changed) {                                   // sweep until nothing new opens
            changed = false;
            for (int i = 0; i < n; i++) {
                if (!open[i]) continue;
                for (int k : rooms.get(i)) if (!open[k]) { open[k] = true; changed = true; }
            }
        }
        for (boolean b : open) if (!b) return false;
        return true;
    }
}
