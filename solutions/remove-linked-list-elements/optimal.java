class Solution {
    public ListNode removeElements(ListNode head, int val) {
        ListNode dummy = new ListNode(0, head), prev = dummy;
        while (prev.next != null) {
            if (prev.next.val == val) prev.next = prev.next.next;   // unlink
            else prev = prev.next;
        }
        return dummy.next;
    }
}
