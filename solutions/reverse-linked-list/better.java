class Solution {
    public ListNode reverseList(ListNode head) {
        if (head == null || head.next == null) return head;
        ListNode newHead = reverseList(head.next);   // reverse the rest
        head.next.next = head;                       // attach head at its end
        head.next = null;
        return newHead;
    }
}
