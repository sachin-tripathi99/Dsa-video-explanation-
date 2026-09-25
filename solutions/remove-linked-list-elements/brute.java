class Solution {
    public ListNode removeElements(ListNode head, int val) {
        ListNode dummy = new ListNode(0), tail = dummy;
        for (ListNode c = head; c != null; c = c.next) {
            if (c.val != val) { tail.next = new ListNode(c.val); tail = tail.next; }
        }
        return dummy.next;
    }
}
