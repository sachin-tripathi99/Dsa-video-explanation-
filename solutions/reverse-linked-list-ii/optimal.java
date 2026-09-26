class Solution {
    public ListNode reverseBetween(ListNode head, int left, int right) {
        ListNode dummy = new ListNode(0, head), before = dummy;
        for (int i = 1; i < left; i++) before = before.next;
        ListNode first = before.next, after = first;
        for (int i = left; i <= right; i++) after = after.next;       // node after the piece
        ListNode prev = after, cur = first;
        for (int i = left; i <= right; i++) {                         // reverse the piece
            ListNode next = cur.next;
            cur.next = prev;
            prev = cur;
            cur = next;
        }
        before.next = prev;                                           // reconnect the front
        return dummy.next;
    }
}
