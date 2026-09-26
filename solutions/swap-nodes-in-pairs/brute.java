class Solution {
    public ListNode swapPairs(ListNode head) {
        List<ListNode> nodes = new ArrayList<>();
        for (ListNode p = head; p != null; p = p.next) nodes.add(p);
        for (int i = 0; i + 1 < nodes.size(); i += 2) Collections.swap(nodes, i, i + 1);
        ListNode dummy = new ListNode(0), p = dummy;
        for (ListNode x : nodes) { p.next = x; p = x; }
        p.next = null;
        return dummy.next;
    }
}
