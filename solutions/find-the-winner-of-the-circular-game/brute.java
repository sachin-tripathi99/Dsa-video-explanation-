class Solution {
    public int findTheWinner(int n, int k) {
        List<Integer> friends = new ArrayList<>();
        for (int i = 1; i <= n; i++) friends.add(i);
        int idx = 0;
        while (friends.size() > 1) {
            idx = (idx + k - 1) % friends.size();   // k-th friend, counting the start
            friends.remove(idx);                     // next count starts at this index
        }
        return friends.get(0);
    }
}
