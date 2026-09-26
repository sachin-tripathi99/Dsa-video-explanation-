class Solution {
    public ListNode detectCycle(ListNode head) {
        Set<ListNode> seen = new HashSet<>();
        for (ListNode p = head; p != null; p = p.next)
            if (!seen.add(p)) return p;
        return null;
    }
}
