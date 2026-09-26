class Solution {
    public boolean isPalindrome(ListNode head) {
        List<Integer> vals = new ArrayList<>();
        for (ListNode p = head; p != null; p = p.next) vals.add(p.val);
        for (int l = 0, r = vals.size() - 1; l < r; l++, r--)
            if (!vals.get(l).equals(vals.get(r))) return false;
        return true;
    }
}
