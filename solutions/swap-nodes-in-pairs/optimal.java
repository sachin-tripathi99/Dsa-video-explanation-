class Solution {
    public ListNode swapPairs(ListNode head) {
        ListNode dummy = new ListNode(0, head), prev = dummy;
        while (prev.next != null && prev.next.next != null) {
            ListNode a = prev.next, b = a.next;
            a.next = b.next;        // a points past the pair
            b.next = a;             // b points back at a
            prev.next = b;          // the pair now starts with b
            prev = a;
        }
        return dummy.next;
    }
}
