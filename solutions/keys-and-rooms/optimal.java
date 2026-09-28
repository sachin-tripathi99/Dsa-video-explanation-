class Solution {
    public boolean canVisitAllRooms(List<List<Integer>> rooms) {
        boolean[] seen = new boolean[rooms.size()];
        Deque<Integer> st = new ArrayDeque<>();
        seen[0] = true;
        st.push(0);
        int count = 1;
        while (!st.isEmpty()) {
            for (int k : rooms.get(st.pop()))
                if (!seen[k]) { seen[k] = true; count++; st.push(k); }   // new room
        }
        return count == rooms.size();
    }
}
