class Solution {
    public int pairSum(ListNode head) {
        List<Integer> vals = new ArrayList<>();
        for (ListNode p = head; p != null; p = p.next) vals.add(p.val);
        int n = vals.size(), best = 0;
        for (int i = 0; i < n / 2; i++) best = Math.max(best, vals.get(i) + vals.get(n - 1 - i));
        return best;
    }
}
