export const HandleYearInCopyright = () => {
    const year = document.querySelector("body > footer > span");

    const defaultYear = year.textContent;
    const currentYear = new Date().getFullYear();

    if (defaultYear === currentYear.toString()) {
        return;
    }
    else {
        year.textContent = `${defaultYear} - ${currentYear.toString()}`;
    }
}