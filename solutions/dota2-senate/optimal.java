class Solution {
    public String predictPartyVictory(String senate) {
        int n = senate.length();
        Deque<Integer> r = new ArrayDeque<>(), d = new ArrayDeque<>();
        for (int i = 0; i < n; i++) (senate.charAt(i) == 'R' ? r : d).offer(i);
        while (!r.isEmpty() && !d.isEmpty()) {
            int a = r.poll(), b = d.poll();
            if (a < b) r.offer(a + n);          // R votes first, bans D, votes again next round
            else d.offer(b + n);
        }
        return r.isEmpty() ? "Dire" : "Radiant";
    }
}
