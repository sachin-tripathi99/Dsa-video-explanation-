class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        if (!head || !head->next) return head;
        ListNode* newHead = reverseList(head->next);  // reverse the rest
        head->next->next = head;                      // attach head at its end
        head->next = nullptr;
        return newHead;
    }
};
